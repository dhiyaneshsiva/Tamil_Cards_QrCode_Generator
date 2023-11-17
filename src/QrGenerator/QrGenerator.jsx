import React, { useEffect, useState } from "react";
import "./QrGenerator.css";

// Mantine Core
import { Button, Center, Flex, Input, ThemeIcon } from "@mantine/core";

// Qr Code
import QRCode from "react-qr-code";

// Qr to Image
import html2canvas from "html2canvas";

// Mantine Notification
import { showNotification } from "@mantine/notifications";

// Tabler ICons
import { X } from "tabler-icons-react";

// Firebase Database
import { db } from "../Firebase/Firebase";

// uid
import { uid } from "uid";
import { onValue, ref, set } from "firebase/database";
// CSS
const inputDiv = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
  marginTop: "4rem",
};

const qrDiv = {
  width: "fit-content",
  margin: "auto",
  height: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
};

const downloadContainer = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
          a.download = `${fileName.replaceAll(" ", "_")}.webp`;
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
          <Input.Wrapper
          label="Qr Code Value"
          >
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
          <Button
            onClick={() => {
              setQrStatus(true);
              writeData();
            }}
            size="md"
          >
            Generate QR Code
          </Button>
        </div>
        {/* Input & Button End */}

        {/* Qr Code */}
        {qrStatus && (
          <div style={qrDiv} id="qrCodeDiv">
            <QRCode value={`${inputValue} powered by Tamil Cards`} />
          </div>
        )}
        {/* Qr Code End */}

        {/* Download Button */}
        {qrStatus && (
          <div>
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
