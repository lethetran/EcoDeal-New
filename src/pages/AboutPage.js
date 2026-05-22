import React from "react";
import { Link } from "react-router-dom";
import "./AboutPage.css"; // Import your CSS styles
import {useOnScreen} from "../hooks/useOnScreenAboutPage"; // Import custom hook
import Header from "../components/Landing/Header";
import Footer from "../components/Home/Footer";

// Component nhỏ để tạo hiệu ứng đếm số
const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = React.useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.5 });

  React.useEffect(() => {
    if (isVisible) {
      let start = 0;
      const endNum = parseInt(end) || 0;
      if (start === endNum) return;

      let totalMilSecDur = parseInt(duration) * 1000; // Chuyển đổi giây sang mili giây
      let incrementTime = totalMilSecDur / endNum;

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= endNum) {
          setCount(endNum); // Đảm bảo nó dừng chính xác ở số cuối
          clearInterval(timer);
        }
      }, incrementTime);

      // Hàm dọn dẹp để tránh memory leak
      return () => clearInterval(timer);
    }
  }, [isVisible, duration, end]);

  // Sử dụng toLocaleString để tự động thêm dấu phẩy hàng nghìn
  return <span ref={ref}>{count.toLocaleString("vi-VN")}</span>;
};

const AboutPage = () => {
  // Tạo các ref và state cho từng section để trigger animation
  const [missionRef, isMissionVisible] = useOnScreen({ threshold: 0.2 });
  const [storyRef, isStoryVisible] = useOnScreen({ threshold: 0.3 });
  const [teamRef, isTeamVisible] = useOnScreen({ threshold: 0.1 });
  const [ctaRef, isCtaVisible] = useOnScreen({ threshold: 0.4 });

  return (
    <>
    
    <div className="about-page-v2">
        <Header />
      {/* 1. Hero Section */}
      <section className="about-hero-v2">
        <div className="hero-background-image"></div>
        <div className="container">
          <p className="hero-eyebrow animate-fade-in">PheniFood Story</p>
          <h1 className="hero-title-v2 animate-fade-in-up delay-1">
            Không chỉ là bữa ăn, đó là một sứ mệnh.
          </h1>
          <p className="hero-subtitle-v2 animate-fade-in-up delay-2">
            Chúng tôi tin rằng mỗi món ăn ngon đều xứng đáng có một cơ hội. Cùng
            PheniFood định nghĩa lại giá trị của thực phẩm.
          </p>
        </div>
      </section>

      {/* 2. Impact Section */}
      <section
        ref={missionRef}
        className={`impact-section ${isMissionVisible ? "is-visible" : ""}`}
      >
        <div className="container">
          <div className="impact-grid">
            <div className="impact-card animate-slide-in-left">
              <div className="impact-number">
                <Counter end={10000} />+
              </div>
              <div className="impact-text">Bữa ăn đã được giải cứu</div>
            </div>
            <div className="impact-card animate-slide-in-up">
              <div className="impact-number">
                <Counter end={200} />+
              </div>
              <div className="impact-text">Đối tác cửa hàng tin cậy</div>
            </div>
            <div className="impact-card animate-slide-in-right">
              <div className="impact-number">
                <Counter end={5000} />+
              </div>
              <div className="impact-text">Kg thực phẩm được tiết kiệm</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Story Section */}
      <section
        ref={storyRef}
        className={`story-section-v2 ${isStoryVisible ? "is-visible" : ""}`}
      >
        <div className="container">
          <div className="story-item">
            <div className="story-image-wrapper animate-slide-in-left">
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800"
                alt="Team discussing"
              />
            </div>
            <div className="story-content-wrapper animate-fade-in-up">
              <span className="story-tag">Khởi đầu</span>
              <h2>Một ý tưởng nảy mầm từ sự trân trọng</h2>
              <p>
                Mọi chuyện bắt đầu khi chúng tôi nhìn thấy những chiếc bánh mì,
                những phần ăn còn thơm ngon bị bỏ đi. Một câu hỏi lớn được đặt
                ra: "Làm thế nào để kết nối chúng với những người đang tìm kiếm
                một bữa ăn chất lượng với giá phải chăng?". Đó là lúc PheniFood
                ra đời.
              </p>
            </div>
          </div>

          <div className="story-item reverse">
            <div className="story-image-wrapper animate-slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800"
                alt="Team collaborating"
              />
            </div>
            <div className="story-content-wrapper animate-fade-in-up">
              <span className="story-tag">Hành trình</span>
              <h2>Xây dựng một cộng đồng bền vững</h2>
              <p>
                Chúng tôi không chỉ xây dựng một ứng dụng, mà là một hệ sinh
                thái. Nơi các đối tác có thể giảm lãng phí, tăng doanh thu. Nơi
                người dùng có thể tiết kiệm chi tiêu mà vẫn ăn ngon. Và quan
                trọng nhất, nơi tất cả chúng ta cùng chung tay vì một hành tinh
                xanh hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Team Section */}
      <section
        ref={teamRef}
        className={`team-section-v2 ${isTeamVisible ? "is-visible" : ""}`}
      >
        <div className="container">
          <h2 className="section-title-v2 animate-fade-in-up">
            Những người thuyền trưởng
          </h2>
          <div className="team-grid-v2">
            {/* Dữ liệu teamMembers từ câu trả lời trước */}
            {[
              {
                name: "Đỗ Thị Mỹ Hạnh",
                role: "Developer",
                image:
                  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=300",
              },
              {
                name: "Lê Thế Trân",
                role: "Developer",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
              },
              
            ].map((member, index) => (
              <div
                key={member.name}
                className={`team-member-card-v2 animate-fade-in-up delay-${index + 1}`}
              >
                <div className="team-member-image-wrapper">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section
        ref={ctaRef}
        className={`cta-section-v2 ${isCtaVisible ? "is-visible" : ""}`}
      >
        <div className="container cta-container-v2 animate-fade-in">
          <h2>Bạn đã sẵn sàng tham gia cuộc cách mạng ẩm thực?</h2>
          <p>
            Trở thành một phần của PheniFood và cùng chúng tôi viết tiếp câu
            chuyện này.
          </p>
          <div className="cta-buttons-v2">
            <Link to="/promotions" className="btn_home btn--primary">
              Tìm ưu đãi ngay
            </Link>
            <Link to="/partner-register" className="btn_home btn--outline">
              Đăng ký đối tác
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default AboutPage;
