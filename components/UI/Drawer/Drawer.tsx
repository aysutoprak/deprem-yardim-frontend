import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { default as MuiDrawer } from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import styles from "./Drawer.module.css";
import Tag from "../Tag/Tag";
import { Tags } from "../Tag/Tag.types";
import CloseIcon from "@mui/icons-material/Close";
import { useWindowSize } from "@/hooks/useWindowsSize";
import { IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { KeyboardEvent, MouseEvent } from "react";
import { useDrawerData, useIsDrawerOpen } from "@/stores/mapStore";

interface DrawerProps {
  toggler: (_e: KeyboardEvent | MouseEvent) => void;
}

function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@${lat},${lng},22z`;
}

export default function Drawer({ toggler }: DrawerProps) {
  const isOpen = useIsDrawerOpen();
  const data = useDrawerData();
  const size = useWindowSize();
  const [openBillboardSnackbar, setOpenBillboardSnackbar] = useState(false);

  function copyBillboard(url: string) {
    navigator.clipboard.writeText(url);
    setOpenBillboardSnackbar(true);
  }

  const list = useMemo(() => {
    if (!data) {
      return null;
    }
    const { geometry, formatted_address } = data;
    return (
      <Box
        sx={{
          width: size.width > 768 ? 372 : "full",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
        onKeyDown={(e) => toggler(e)}
      >
        <div className={styles.content}>
          <Tag color={Tags["mid"]?.color}>{Tags["mid"]?.intensity}</Tag>
          <h3>{formatted_address}</h3>
          <p> {`${geometry.location.lat}"N ${geometry.location.lng}"E`}</p>
          <div className={styles.contentButton}>
            <Button
              variant="contained"
              onClick={() =>
                window.open(
                  generateGoogleMapsUrl(
                    geometry.location.lat,
                    geometry.location.lng
                  ),
                  "_blank"
                )
              }
            >
              Google Haritalar ile gör
            </Button>
          </div>
          <div>
            <TextField
              fullWidth
              variant="standard"
              value={generateGoogleMapsUrl(
                geometry.location.lat,
                geometry.location.lng
              )}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() =>
                        copyBillboard(
                          generateGoogleMapsUrl(
                            geometry.location.lat,
                            geometry.location.lng
                          )
                        )
                      }
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </div>
        </div>
        <CloseIcon onClick={(e) => toggler(e)} className={styles.closeButton} />
      </Box>
    );
  }, [data, size.width, toggler]);

  return (
    <div>
      <Snackbar
        open={openBillboardSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenBillboardSnackbar(false)}
        message="Adres Kopyalandı"
      />
      <MuiDrawer
        className="drawer"
        anchor={size.width > 768 ? "left" : "bottom"}
        open={isOpen}
        onClose={(e) => toggler(e as MouseEvent)}
      >
        {list}
      </MuiDrawer>
    </div>
  );
}
