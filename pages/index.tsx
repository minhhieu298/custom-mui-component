import React, { useEffect, useRef, useState } from "react";
import { AutoSizer, Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";

type OtpInputProps = {
  value: string; // chuỗi OTP, ví dụ "123456"
  onChange: (value: string) => void;
  error?: boolean; // để tô viền đỏ
};

const OTP_LENGTH = 6;

// Component nhập OTP gồm 6 ô với các rule focus/xoá/overwrite như đã mô tả
function OtpInput({ value, onChange, error }: OtpInputProps) {
  const otpArray = Array(OTP_LENGTH)
    .fill("")
    .map((_, i) => value[i] ?? "");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const isProgrammaticFocus = useRef(false);

  // Vừa render lần đầu sẽ focus vào ô đầu tiên
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Tìm index của ô trống đầu tiên trong mảng giá trị
  const getFirstEmptyIndex = (values: string[]) => {
    return values.findIndex((v) => v === "");
  };

  // Quyết định index nào được phép nhập (các ô khác sẽ readOnly)
  const canEditIndex = (index: number) => {
    const firstEmptyIndex = getFirstEmptyIndex(otpArray);

    // còn ô trống -> chỉ cho nhập đúng ô trống đầu tiên
    if (firstEmptyIndex !== -1) {
      return index === firstEmptyIndex;
    }

    // không còn ô trống (đủ 6 số) -> chỉ cho nhập ô cuối cùng
    // (muốn sửa giữa phải backspace từ phải sang trái)
    return index === OTP_LENGTH - 1;
  };

  const updateOtp = (index: number, digit: string) => {
    const newOtp = [...otpArray];
    newOtp[index] = digit;
    onChange(newOtp.join(""));
  };

  // Xử lý khi người dùng thay đổi giá trị ở một ô (onChange)
  const handleChange = (index: number, raw: string) => {
    // Khi bắt đầu nhập lại ở ô đầu tiên thì xoá trạng thái lỗi và trả viền về bình thường
    const cleaned = raw.replace(/\D/g, "");
    const digit = cleaned.slice(-1);
    if (!digit) return;

    updateOtp(index, digit);

    if (digit && index < OTP_LENGTH - 1) {
      isProgrammaticFocus.current = true;
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Xử lý keydown: overwrite số khi đang có sẵn, và logic Backspace 2 lần
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (/^[0-9]$/.test(e.key)) {
      // Ô hiện tại đã có giá trị -> chặn default và tự overwrite
      if (otpArray[index]) {
        e.preventDefault();
        updateOtp(index, e.key); // đè giá trị hiện tại bằng số mới
        return;
      }
      // Nếu ô đang rỗng thì để browser xử lý bình thường
    }
    if (e.key === "Backspace") {
      if (otpArray[index]) {
        // Lần 1: xóa ký tự ở ô hiện tại
        updateOtp(index, "");
        return;
      }

      // Lần 2: ô hiện tại đã rỗng -> back sang ô trước và xóa luôn ô đó
      if (index > 0) {
        const newOtp = [...otpArray];
        newOtp[index - 1] = "";
        onChange(newOtp.join(""));
        isProgrammaticFocus.current = true;
        inputsRef.current[index - 1]?.focus();
        // inputsRef.current[index - 1]?.select(); //chỗ nãy cần bôi đen khi backspace
      }
    }
  };

  // Kiểm soát behavior khi một ô được focus (click chuột, tab, auto-jump)
  const handleFocus = (index: number) => {
    // Nếu là focus do code set (auto-jump) thì bỏ qua hạn chế
    if (isProgrammaticFocus.current) {
      isProgrammaticFocus.current = false;
      if (otpArray[index]) {
        setTimeout(() => {
          inputsRef.current[index]?.select();
        }, 0);
      }
      return;
    }

    const firstEmptyIndex = getFirstEmptyIndex(otpArray);

    // còn ô trống -> kéo về ô trống đầu tiên
    if (firstEmptyIndex !== -1) {
      const targetIndex = firstEmptyIndex;
      if (index !== targetIndex) {
        inputsRef.current[targetIndex]?.focus();
        return;
      }
      // đúng ô được phép nhập -> nếu có giá trị thì select
      if (otpArray[targetIndex]) {
        setTimeout(() => {
          inputsRef.current[targetIndex]?.select();
        }, 0);
      }
      return;
    }

    // không còn ô trống -> luôn kéo về ô cuối
    const lastIndex = OTP_LENGTH - 1;
    if (index !== lastIndex) {
      inputsRef.current[lastIndex]?.focus();
      return;
    }
    // đang ở ô cuối, nếu có giá trị thì select
    if (otpArray[lastIndex]) {
      setTimeout(() => {
        inputsRef.current[lastIndex]?.select();
      }, 0);
    }
  };

  // Xử lý paste: luôn đè toàn bộ OTP hiện tại bằng chuỗi mới
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "");

    // luôn đè toàn bộ giá trị cũ
    const newOtp = Array(OTP_LENGTH).fill("") as string[];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    onChange(newOtp.join(""));

    // chọn đúng ô được phép nhập theo rule (trống đầu tiên hoặc ô cuối)
    const firstEmptyIndex = getFirstEmptyIndex(newOtp);
    const focusIndex =
      firstEmptyIndex !== -1 ? firstEmptyIndex : OTP_LENGTH - 1;

    // đánh dấu đây là focus do code để handleFocus không can thiệp
    isProgrammaticFocus.current = true;
    inputsRef.current[focusIndex]?.focus();
  };

  const prevErrorRef = useRef<boolean>(false);

  // Khi từ trạng thái không lỗi -> lỗi: clear OTP và focus ô đầu tiên
  useEffect(() => {
    const prev = prevErrorRef.current;
    const current = !!error;

    if (!prev && current) {
      // clear toàn bộ giá trị
      onChange("");

      // focus lại ô đầu
      isProgrammaticFocus.current = true;
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 0);
    }

    prevErrorRef.current = current;
  }, [error, onChange]);

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginTop: "16px",
      }}
    >
      {otpArray.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[index] = el;
          }}
          readOnly={!canEditIndex(index)}
          style={{
            width: "40px",
            height: "40px",
            textAlign: "center",
            fontSize: "18px",
            border: error ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      ))}
    </div>
  );
}

type FormValues = {
  otp: string;
};

const generateRandomData = () => {
  const firstNames = [
    "Nguyen",
    "Tran",
    "Le",
    "Pham",
    "Ho",
    "Vu",
    "Dang",
    "Bui",
    "Do",
    "H",
  ];
  const lastNames = [
    "An",
    "Binh",
    "Chi",
    "Dung",
    "Giang",
    "Hai",
    "Khoa",
    "Lam",
    "Minh",
    "Nhan",
  ];
  const departments = ["IT", "HR", "Marketing", "Sales", "Finance"];
  const positions = [
    "Manager",
    "Developer",
    "Designer",
    "Analyst",
    "Consultant",
  ];

  const data = [];
  for (let i = 1; i <= 100; i++) {
    const record = {
      id: i.toString(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
        lastNames[Math.floor(Math.random() * lastNames.length)]
      }`,
      email: `user${i}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: Math.floor(Math.random() * 50000) + 30000,
      keyValue: `key_${i}:value_${Math.floor(Math.random() * 1000)}`,
    };
    data.push(record);
  }
  return data;
};

const arr = generateRandomData();

// Component demo dùng để mount/unmount OtpInput bằng nút bấm
export default function Home() {
  const [isState, setIsState] = useState(false);
  useEffect(() => {
    setIsState(true);
  }, []);

  if (!isState) return null;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <AutoSizer>
        {({ height, width }) => {
          console.log({ width, height });

          return (
            <>
              <div style={{ width: width, height: "40px", paddingRight: 8 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        rowSpan={2}
                        style={{ width: "16.6%", background: "red" }}
                      >
                        ID
                      </th>
                      <th colSpan={2}>User Name</th>
                      <th
                        rowSpan={2}
                        style={{ width: "16.6%", background: "orange" }}
                      >
                        Department
                      </th>
                      <th
                        rowSpan={2}
                        style={{ width: "16.6%", background: "purple" }}
                      >
                        Position
                      </th>
                      <th
                        rowSpan={2}
                        style={{ width: "16.6%", background: "yellow" }}
                      >
                        KeyValue
                      </th>
                    </tr>
                    <tr>
                      <th style={{ width: "16.6%", background: "blue" }}>
                        Name
                      </th>
                      <th style={{ width: "16.6%", background: "green" }}>
                        Email
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <Table
                width={width}
                height={height}
                rowCount={arr.length}
                rowHeight={40}
                headerHeight={0}
                disableHeader={true}
                rowGetter={({ index }) => arr[index]}
                rowStyle={
                  {
                    // paddingRight: 0
                  }
                }
                headerStyle={{ margin: 0 }}
                style={{ margin: 0 }}
              >
                <Column
                  label="ID"
                  dataKey="id"
                  width={width * 0.166}
                  headerStyle={{ color: "white", margin: 0 }}
                  style={{ background: "#cecece", margin: 0 }}
                  flexShrink={1}
                  flexGrow={0}
                />
                <Column
                  label="Name"
                  dataKey="name"
                  width={width * 0.166}
                  flexShrink={1}
                  flexGrow={0}
                  style={{ background: "pink", margin: 0 }}
                  headerStyle={{ color: "white", margin: 0 }}
                />
                <Column
                  label="Email"
                  dataKey="email"
                  width={width * 0.166}
                  flexShrink={1}
                  flexGrow={0}
                  style={{ background: "#e0e0e0", margin: 0 }}
                  headerStyle={{ color: "white", margin: 0 }}
                />
                <Column
                  label="Department"
                  dataKey="department"
                  width={width * 0.166}
                  flexShrink={1}
                  flexGrow={0}
                  style={{ background: "#f0f0f0", margin: 0 }}
                  headerStyle={{ color: "white", margin: 0 }}
                />
                <Column
                  label="Position"
                  dataKey="position"
                  width={width * 0.166}
                  flexShrink={1}
                  flexGrow={0}
                  style={{ background: "#d0d0d0", margin: 0 }}
                  headerStyle={{ color: "white", margin: 0 }}
                />
                <Column
                  label="KeyValue"
                  dataKey="keyValue"
                  width={width * 0.166}
                  flexShrink={1}
                  flexGrow={0}
                  style={{ background: "#ffffcc", margin: 0 }}
                  headerStyle={{ color: "black", margin: 0 }}
                />
              </Table>
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
}
