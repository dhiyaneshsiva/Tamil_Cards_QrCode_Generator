import React, { useEffect, useRef, useState } from "react";

// Mantine Core
import { Button, Center, Flex, Input, ThemeIcon } from "@mantine/core";

// Qr Code
import QRCode from "react-qr-code";

// Qr to Image
import html2canvas from "html2canvas";
import { showNotification } from "@mantine/notifications";
import { X } from "tabler-icons-react";

// CSS
const inputDiv = {
  width: "100%",
  height: "10vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
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

  useEffect(() => {
    if (inputValue) {
      setFileName(inputValue.trim());
    }
  }, [inputValue]);

  return (
    <div>
      {/* Input & Button */}
      <div style={inputDiv}>
        <Input
          onChange={(e) => setInptValue(e.target.value)}
          size="md"
          w={"200px"}
          placeholder="input value for QR Code Generator"
        />
        <Button onClick={() => setQrStatus(true)} size="md">
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
              error={`${fileName ? "" : "Please Enter File Name to Download"}`}
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
  );
};

export default QrGenerator;
