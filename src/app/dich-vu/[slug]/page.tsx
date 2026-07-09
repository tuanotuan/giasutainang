import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, CircleHelp, Home } from "lucide-react";
import { CTABox } from "@/components/common/CTABox";
import { PricingPreview } from "@/components/home/PricingPreview";
import { serviceContents } from "@/data/services";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return serviceContents.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceContents.find((item) => item.slug === slug);
  return service ? { title: service.title, description: service.summary } : {};
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceContents.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <header className="bg-primary-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-primary-100" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" /><Link href="/dich-vu">Dịch vụ</Link>
          </nav>
          <h1 className="max-w-4xl text-3xl font-extrabold sm:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-100">{service.summary}</p>
          <Link href="/dang-ky-tim-gia-su" className="mt-7 inline-flex rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold">Đăng ký tư vấn</Link>
        </div>
      </header>
      <section className="section-space bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Lợi ích nổi bật</span>
            <h2 className="text-3xl font-extrabold text-ink">Lộ trình rõ ràng, trải nghiệm linh hoạt</h2>
            <p className="mt-5 leading-8 text-slate-600">Tài Năng bắt đầu bằng việc lắng nghe mục tiêu và đánh giá bối cảnh học tập. Từ đó, gia đình nhận được gợi ý hồ sơ phù hợp thay vì lựa chọn theo một tiêu chí duy nhất. Người dạy sẽ cùng học sinh xác định điểm mạnh, phần kiến thức cần củng cố và nhịp học có thể duy trì lâu dài.</p>
            <p className="mt-4 leading-8 text-slate-600">Trong quá trình học, mục tiêu được chia thành các chặng nhỏ để dễ theo dõi. Phản hồi giữa gia sư, học sinh và phụ huynh giúp điều chỉnh bài tập, thời lượng và phương pháp khi cần thiết.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.benefits.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-5"><CheckCircle2 className="h-6 w-6 text-emerald-500" /><h3 className="mt-4 font-bold text-ink">{item}</h3><p className="mt-2 text-xs leading-5 text-slate-500">Được thiết kế để phù hợp với mục tiêu và điều kiện thực tế của người học.</p></div>)}
          </div>
        </div>
      </section>
      <section className="pb-16 sm:pb-20">
        <div className="container-page max-w-4xl">
          <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-10">
            <h2 className="text-2xl font-extrabold text-ink">Cách Tài Năng triển khai {service.title.toLocaleLowerCase("vi")}</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600">
              <p>Điểm bắt đầu không phải là chọn ngay một hồ sơ có nhiều thành tích, mà là hiểu rõ người học đang cần điều gì. Chuyên viên sẽ hỏi về kiến thức hiện tại, mục tiêu trong vài tháng tới, lịch sinh hoạt và những trải nghiệm học trước đây. Những thông tin này giúp xác định kiểu hỗ trợ phù hợp, đồng thời tránh đặt ra một lịch học quá dày hoặc mục tiêu thiếu thực tế.</p>
              <p>Sau bước trao đổi, gia đình nhận được một số hồ sơ có chuyên môn và thời gian phù hợp. Mỗi hồ sơ trình bày rõ nền tảng học tập, môn dạy, nhóm lớp, khu vực và cách tiếp cận. Gia đình có thể đặt thêm câu hỏi trước khi chọn người học thử. Việc so sánh nên dựa trên khả năng giải thích, sự kiên nhẫn và mức độ phù hợp với học sinh, không chỉ dựa vào tên trường.</p>
              <p>Buổi đầu tiên được dùng để hai bên làm quen và xác định điểm xuất phát. Gia sư có thể dùng câu hỏi ngắn, bài tập nhỏ hoặc trò chuyện về thói quen học để quan sát. Một buổi đánh giá tốt không tạo cảm giác thi cử, mà giúp học sinh hiểu rằng lỗi sai là dữ liệu hữu ích. Sau buổi học, người dạy đề xuất mục tiêu gần và cách theo dõi tiến bộ.</p>
              <p>Lộ trình được chia thành những chặng đủ ngắn để điều chỉnh. Trong mỗi chặng, học sinh biết mình đang luyện kỹ năng nào và vì sao kỹ năng đó quan trọng. Bài tập về nhà được chọn vừa sức, có trọng tâm và gắn với nội dung đã học. Khi học sinh tiến bộ nhanh hoặc gặp trở ngại, số lượng bài, tốc độ giảng và cách minh họa có thể thay đổi thay vì giữ cứng một giáo án.</p>
              <p>Phản hồi giữa ba bên cần ngắn gọn nhưng đều đặn. Gia sư nên thông tin nội dung đã hoàn thành, điểm học sinh làm tốt và một việc cần tiếp tục luyện. Phụ huynh chia sẻ thay đổi về lịch hoặc tâm lý học tập; học sinh được khuyến khích nói điều mình chưa hiểu. Nhờ vậy, những vấn đề nhỏ được xử lý sớm trước khi trở thành cảm giác chán nản hoặc mất tự tin.</p>
              <p>Học phí, lịch nghỉ và hình thức thanh toán cần được thống nhất rõ trước khi học lâu dài. Bảng giá trên website chỉ là mức tham khảo vì chi phí còn phụ thuộc vào môn, cấp lớp, thời lượng và yêu cầu chuyên môn. Tài Năng khuyến khích các bên ghi lại thỏa thuận cơ bản, tôn trọng thời gian của nhau và chủ động báo sớm khi cần đổi lịch.</p>
              <p>Mục tiêu cuối cùng của chương trình là giúp học sinh ngày càng chủ động hơn, không phụ thuộc hoàn toàn vào người dạy. Bên cạnh kiến thức, gia sư hướng dẫn cách đọc đề, đặt câu hỏi, kiểm tra lỗi và lập kế hoạch ngắn. Khi người học biết tự nhận ra điều chưa chắc chắn và tìm cách giải quyết, kết quả đạt được sẽ bền vững hơn một giai đoạn tăng điểm tạm thời.</p>
            </div>
          </article>
        </div>
      </section>
      <section className="section-space bg-slate-50/70">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">Đối tượng phù hợp</h2>
              <div className="mt-5 space-y-3">{service.audiences.map((item) => <p key={item} className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-card"><CheckCircle2 className="h-5 w-5 text-primary-500" />{item}</p>)}</div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-ink">Quy trình đăng ký</h2>
              <ol className="mt-5 space-y-3">{["Chia sẻ nhu cầu và mục tiêu", "Nhận tư vấn lộ trình", "Xem hồ sơ gia sư phù hợp", "Học thử và bắt đầu đồng hành"].map((item, index) => <li key={item} className="flex items-center gap-4 rounded-xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-card"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-extrabold text-white">{index + 1}</span>{item}</li>)}</ol>
            </div>
          </div>
        </div>
      </section>
      <PricingPreview />
      <section className="section-space bg-slate-50/70">
        <div className="container-page max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold text-ink">Câu hỏi thường gặp</h2>
          <div className="mt-8 space-y-4">{service.faq.map((item) => <details key={item.question} className="group rounded-2xl bg-white p-5 shadow-card"><summary className="flex cursor-pointer list-none items-center gap-3 font-bold text-ink"><CircleHelp className="h-5 w-5 text-primary-600" />{item.question}</summary><p className="mt-3 pl-8 text-sm leading-6 text-slate-600">{item.answer}</p></details>)}</div>
        </div>
      </section>
      <CTABox />
    </>
  );
}
