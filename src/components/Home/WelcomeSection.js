// // src/components/WelcomeSection.js
// import React, { useState, useEffect } from 'react';
// import '../../pages/Home.css'; 


// function WelcomeSection() {
//   const fullText = "Chào mừng trở lại, An!";
//   const [typedText, setTypedText] = useState('');

//   useEffect(() => {
//     // Chỉ chạy hiệu ứng một lần khi component được mount
//     if (typedText.length < fullText.length) {
//       const timeoutId = setTimeout(() => {
//         setTypedText(fullText.slice(0, typedText.length + 1));
//       }, 150);
      
//       // Cleanup function để tránh memory leak nếu component unmount
//       return () => clearTimeout(timeoutId);
//     }
//   }, [typedText]); // Dependency là typedText để chạy lại sau mỗi lần state thay đổi

//   return (
//     <section className="welcome section">
//       <div className="container">
//         <h1 className="welcome__title typing-animation">{typedText}</h1>
//         <p className="welcome__subtitle">Cùng xem hôm nay có ưu đãi nào hấp dẫn nhé.</p>
        
//         <div className="filters__container">
//           <div className="quick-filters">
//             <a href="/info" className="filter-btn active">Gần bạn nhất</a>
//             <a href="/promotions" className="filter-btn">Ưu đãi mới</a>
//             <a href="/stores" className="filter-btn">Tiệm bánh</a>
//           </div>
//           <div className="view-toggle">
//             <button className="view-toggle__btn active"><i className='bx bxs-grid-alt'></i></button>
//             <button className="view-toggle__btn"><i className='bx bxs-map'></i></button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default WelcomeSection;