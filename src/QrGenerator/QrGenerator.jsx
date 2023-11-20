import React, { useEffect, useState } from "react";
import "./QrGenerator.css";

// Mantine Core
import { Button, Center, Flex, Input, ThemeIcon } from "@mantine/core";

// Qr to Image
import html2canvas from "html2canvas";

// Mantine Notification
import { showNotification } from "@mantine/notifications";

// QR Code
import { QRCodeCanvas } from "qrcode.react";

// Firebase Database
import { db } from "../Firebase/Firebase";

// Image
import Name from "../Assets/Name.png";

// uid
import { uid } from "uid";
import { onValue, ref, set } from "firebase/database";
import { X } from "tabler-icons-react";
// CSS
const inputDiv = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
  marginTop: "2rem",
};

const qrDiv = {
  width: "fit-content",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  flexDirection: "column",
};

const QrGenerator = () => {
  // States
  const [inputValue, setInptValue] = useState("");
  const [qrStatus, setQrStatus] = useState(false);
  const [fileName, setFileName] = useState(inputValue);
  const [dbData, setDbData] = useState();
  //  Download Qr
  const downloadWebP = () => {
    if (!fileName) {
      showNotification({
        icon: (
          <ThemeIcon variant="light" radius="xl" size="xl" color="red">
            <X color="red" />
          </ThemeIcon>
        ),
        message: "File Name is Compulsory to Download",
      });
    } else {
      const qrCodeDiv = document.getElementById("qrCodeDiv");
      if (qrCodeDiv) {
        html2canvas(qrCodeDiv).then((canvas) => {
          const dataURL = canvas.toDataURL("image/webp");
          const a = document.createElement("a");
          a.href = dataURL;
          a.download = `${fileName.replaceAll(" ", "_")}.jpg`;
          a.click();
        });
      }
    }
  };

  // CRUD Firebase
  // Write
  const writeData = () => {
    const id = uid();
    set(ref(db, `/${id}`), {
      inputValue,
      id,
    });
  };

  // Read
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((value) => {
          setDbData((oldData) => [...oldData, value]);
        });
      }
    });
  }, [inputValue]);

  useEffect(() => {
    if (inputValue) {
      setFileName(inputValue.trim());
    }
  }, [inputValue]);

  return (
    <div>
      <div>
        {/* Input & Button */}
        <div style={inputDiv} className="input-div">
          <Input.Wrapper label="Invitation QR Code">
            <Input
              onChange={(e) => {
                setInptValue(e.target.value);
                setQrStatus(false);
              }}
              size="md"
              w={"200px"}
              placeholder="Type here....."
            />
          </Input.Wrapper>
          <Input.Wrapper label="">
            <Button
              mt={"1.5rem"}
              onClick={() => {
                setQrStatus(true);
                writeData();
              }}
              size="md"
            >
              Generate QR Code
            </Button>
          </Input.Wrapper>
        </div>
        {/* Input & Button End */}

        {/* Qr Code */}
        {qrStatus && (
          <div style={qrDiv} id="qrCodeDiv">
            <div>
              <Center>
                <h1>{inputValue}</h1>
              </Center>
            </div>
            <div>
              <QRCodeCanvas
                value={inputValue}
                size={300}
                fgColor="green"
                imageSettings={{
                  src: Name,
                  x: undefined,
                  y: undefined,
                  height: 100,
                  width: 90,
                  excavate: true,
                }}
                level={"L"}
                includeMargin={false}
              />
            </div>
          </div>
        )}
        {/* Qr Code End */}

        {/* Download Button */}
        {qrStatus && (
          <div style={{ marginTop: "1rem" }}>
            <Center>
              <Input.Wrapper
                error={`${
                  fileName ? "" : "Please Enter File Name to Download"
                }`}
              >
                <Flex align={"center"} gap={2}>
                  File Name:
                  <Input
                    onChange={(e) => setFileName(e.target.value)}
                    variant={fileName ? "unstyled" : "default"}
                    size="sm"
                    radius="md"
                    value={`${fileName}`}
                  />
                </Flex>
              </Input.Wrapper>
            </Center>
            <div style={inputDiv}>
              <Button disabled={!fileName} onClick={downloadWebP} size="md">
                Download QR Code
              </Button>
            </div>
          </div>
        )}
        {/* Download Button End */}
      </div>
    </div>
  );
};

export default QrGenerator;
