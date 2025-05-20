// if user logged in, show the pet list
//if user dont have pet, show the message
//if user have pet, show the pet list
import React, { useEffect, useState } from "react";

import axios from "axios";

function PetListForBooking() {
  const [petList, setPetList] = useState([]);
  const [hasPet, setHasPet] = useState(false);
  useEffect(() => {
    // Lấy userId từ localStorage
    const userDataString = localStorage.getItem("user_info");

    const userId = userDataString ? JSON.parse(userDataString).id : null;
    console.log(userId);
    if (!userId) {
      // Nếu không có userId, chuyển hướng về trang đăng nhập
      alert("Please log in to view your pet list.");
    }
    // Kiểm tra xem bảng userpets có tồn tại hay không

    // Gọi API để lấy danh sách thú cưng của người dùng
    axios
      .get(`http://localhost:8000/api/user/${userId}/userpets`)
      .then((response) => {
        const userpets = response.data;
        if (userpets.length > 0) {
          setPetList(userpets);
          setHasPet(true);
        } else {
          setHasPet(false);
        }
      });
  }, []);
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <h1>Pet List for Booking</h1>

      {hasPet ? (
        <p>HAVE PET LIST</p>
      ) : (
        <p>You don't have any pets. Please add a pet to book.</p>
      )}
    </div>
  );
}
export default PetListForBooking;
