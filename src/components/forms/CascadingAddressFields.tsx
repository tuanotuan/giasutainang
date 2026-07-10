"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { provinceOptions } from "@/data/form-options";
import type { FindTutorFormValues } from "@/lib/validations";
import { fieldClass, FormField } from "./FormControls";

type LocationOption = { code: number; name: string };
type ProvinceDetail = LocationOption & { districts?: LocationOption[] };
type DistrictDetail = LocationOption & { wards?: LocationOption[] };

const API = "https://provinces.open-api.vn/api/v1";

export function CascadingAddressFields({
  register,
  setValue,
  errors,
}: {
  register: UseFormRegister<FindTutorFormValues>;
  setValue: UseFormSetValue<FindTutorFormValues>;
  errors: FieldErrors<FindTutorFormValues>;
}) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);
  const [loading, setLoading] = useState<"province" | "district" | "ward" | "">("province");
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const loadProvinces = useCallback(async () => {
    setLoading("province"); setLoadError(false);
    try {
      const response = await fetch(`${API}/p/`);
      if (!response.ok) throw new Error();
      const items = await response.json() as LocationOption[];
      setProvinces(items);
      const defaultProvince = items.find((item) => item.name === "Thành phố Hồ Chí Minh");
      if (defaultProvince) {
        setProvinceCode(defaultProvince.code);
        setValue("province", defaultProvince.name);
      }
    } catch {
      setProvinces(provinceOptions.map((name, index) => ({ name, code: -(index + 1) })));
      setLoadError(true);
    } finally { setLoading(""); }
  }, [setValue]);

  useEffect(() => { void loadProvinces(); }, [loadProvinces, reloadKey]);

  useEffect(() => {
    if (!provinceCode || provinceCode < 0) { setDistricts([]); return; }
    const controller = new AbortController();
    setLoading("district"); setLoadError(false);
    fetch(`${API}/p/${provinceCode}?depth=2`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: ProvinceDetail) => setDistricts(data.districts ?? []))
      .catch((error) => { if (error?.name !== "AbortError") setLoadError(true); })
      .finally(() => setLoading((current) => current === "district" ? "" : current));
    return () => controller.abort();
  }, [provinceCode]);

  useEffect(() => {
    if (!districtCode) { setWards([]); return; }
    const controller = new AbortController();
    setLoading("ward"); setLoadError(false);
    fetch(`${API}/d/${districtCode}?depth=2`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: DistrictDetail) => setWards(data.wards ?? []))
      .catch((error) => { if (error?.name !== "AbortError") setLoadError(true); })
      .finally(() => setLoading((current) => current === "ward" ? "" : current));
    return () => controller.abort();
  }, [districtCode]);

  return (
    <>
      <FormField label="Tỉnh / Thành phố" required error={errors.province?.message}>
        <div className="relative">
          <select
            {...register("province", {
              onChange: (event) => {
                const selected = event.target.selectedOptions[0];
                setProvinceCode(Number(selected?.dataset.code) || null);
                setDistrictCode(null); setDistricts([]); setWards([]);
                setValue("district", "", { shouldValidate: true });
                setValue("ward", "", { shouldValidate: true });
              },
            })}
            className={fieldClass}
            disabled={loading === "province"}
          >
            <option value="">{loading === "province" ? "Đang tải tỉnh, thành phố..." : "Chọn tỉnh hoặc thành phố"}</option>
            {provinces.map((item) => <option key={item.code} value={item.name} data-code={item.code}>{item.name}</option>)}
          </select>
          {loading === "province" && <Loader2 className="pointer-events-none absolute right-10 top-4 h-4 w-4 animate-spin text-primary-500" />}
        </div>
      </FormField>

      <FormField label="Quận / Huyện / Khu vực" required error={errors.district?.message}>
        <div className="relative">
          <select
            {...register("district", {
              onChange: (event) => {
                const selected = event.target.selectedOptions[0];
                setDistrictCode(Number(selected?.dataset.code) || null); setWards([]);
                setValue("ward", "", { shouldValidate: true });
              },
            })}
            className={fieldClass}
            disabled={!provinceCode || provinceCode < 0 || loading === "district"}
          >
            <option value="">{loading === "district" ? "Đang tải khu vực..." : provinceCode ? "Chọn quận, huyện hoặc khu vực" : "Chọn tỉnh, thành phố trước"}</option>
            {districts.map((item) => <option key={item.code} value={item.name} data-code={item.code}>{item.name}</option>)}
          </select>
          {loading === "district" && <Loader2 className="pointer-events-none absolute right-10 top-4 h-4 w-4 animate-spin text-primary-500" />}
        </div>
      </FormField>

      <FormField label="Phường / Xã / Thị trấn" required error={errors.ward?.message}>
        <div className="relative">
          <select {...register("ward")} className={fieldClass} disabled={!districtCode || loading === "ward"}>
            <option value="">{loading === "ward" ? "Đang tải phường, xã..." : districtCode ? "Chọn phường, xã hoặc thị trấn" : "Chọn quận, huyện trước"}</option>
            {wards.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}
          </select>
          {loading === "ward" && <Loader2 className="pointer-events-none absolute right-10 top-4 h-4 w-4 animate-spin text-primary-500" />}
        </div>
      </FormField>

      {loadError && <div className="sm:col-span-2"><p className="text-xs leading-5 text-amber-700">Chưa tải được danh sách địa chỉ. Kiểm tra mạng rồi thử lại.</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-50 px-3 text-xs font-bold text-amber-800"><RefreshCw className="h-4 w-4" /> Tải lại danh sách</button></div>}
    </>
  );
}
