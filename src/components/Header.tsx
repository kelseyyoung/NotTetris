import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { HelpModal } from "./HelpModal";

type HeaderProps = {
  onAutoComplete: () => void;
  onRestart: () => void;
  gameStarted: boolean;
};

export const Header = ({
  onAutoComplete,
  onRestart,
  gameStarted,
}: HeaderProps) => {
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showRestartDialog, setShowRestartDialog] = useState<boolean>(false);

  const handleRestartClick = () => {
    setShowRestartDialog(true);
  };

  const handleRestartConfirm = () => {
    setShowRestartDialog(false);
    onRestart();
  };

  const handleRestartCancel = () => {
    setShowRestartDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 16px" /* Reduced padding for compact header */,
          paddingTop: "8px",
          boxSizing: "border-box",
        }}
      >
        {/* Auto and Restart buttons in top left - only show when game is started */}
        {gameStarted && (
          <Box
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              onClick={onAutoComplete}
              variant="outlined"
              size="small"
              sx={{
                minWidth: "auto",
                px: 1.5,
              }}
              aria-label="autocomplete"
            >
              Auto
            </Button>
            <Button
              onClick={handleRestartClick}
              variant="outlined"
              size="small"
              sx={{
                minWidth: "auto",
                px: 1.5,
              }}
              aria-label="restart game"
            >
              <ArrowBackIcon fontSize="small" />
            </Button>
          </Box>
        )}

        {/* Centered logo */}
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}NewLogo.png`}
          alt="Logo"
          sx={{
            height: { xs: 40, sm: 50 }, // Smaller logo on mobile, larger on desktop
            objectFit: "contain",
          }}
        />

        {/* Help button in top right */}
        <IconButton
          onClick={() => setShowHelpModal(true)}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="help"
          size="small"
        >
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Help Modal with Backdrop */}
      <Backdrop
        open={showHelpModal}
        onClick={() => setShowHelpModal(false)}
        sx={{ zIndex: 999 }}
      >
        <Box onClick={(e) => e.stopPropagation()}>
          <HelpModal onClose={() => setShowHelpModal(false)} />
        </Box>
      </Backdrop>

      {/* Restart Confirmation Dialog */}
      <Dialog
        open={showRestartDialog}
        onClose={handleRestartCancel}
        aria-labelledby="restart-dialog-title"
        aria-describedby="restart-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="restart-dialog-description">
            Go back to the home screen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRestartConfirm}
            color="primary"
            variant="contained"
            autoFocus
          >
            Yes
          </Button>
          <Button onClick={handleRestartCancel} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
