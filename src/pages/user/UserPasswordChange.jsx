const UserPasswordChange = () => {
  return (
    <section className="password-change">
      <div className=" bg-center bg-cover md:bg-no-repeat bg-[url('/bg-desktop.png')]">
        <div className="h-screen flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg md:w-1/5 mx-6">
            <h1 className="text-2xl font-semibold mb-4 text-center">
              เปลี่ยนแปลงรหัสผ่าน
            </h1>
            <form>
              <div className="mb-4 mx-4">
                <label
                  htmlFor="current-password"
                  className="block text-gray-700"
                >
                  รหัสผ่านเก่า
                </label>
                <input
                  type="password"
                  id="current-password"
                  className="input input-bordered w-full mt-2"
                  placeholder="********"
                />
              </div>
              <div className="mb-4 mx-4">
                <label htmlFor="new-password" className="block text-gray-700">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="input input-bordered w-full mt-2 ;"
                  placeholder="********"
                />
              </div>
              <div className="mb-4 mx-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-gray-700"
                >
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="input input-bordered w-full mt-2"
                  placeholder="********"
                />
              </div>
              <ul className="text-sm text-gray-600 mb-4 list-disc list-inside mx-4">
                <li>รหัสผ่านต้องมีความยาวอย่างน้อย 8-12 ตัวอักษร</li>
                <li>
                  ควรมีตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และสัญลักษณ์พิเศษ
                  (@#$%^&*)
                </li>
                <li>
                  หลีกเลี่ยงการใช้ชื่อ วันเกิด หมายเลขโทรศัพท์
                  หรือข้อมูลที่เดาได้ง่าย
                </li>
                <li>รหัสผ่านไม่สามารถเว้นว่างได้</li>
              </ul>
              <button
                type="submit"
                className="btn w-full bg-blue-500 hover:bg-blue-700 text-white rounded-full "
              >
                อัพเดตรหัสผ่าน
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPasswordChange;
