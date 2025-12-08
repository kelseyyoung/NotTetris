import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { MoveShapeDirection } from "../objects/Grid";

type ArrowButtonProps = {
  direction: MoveShapeDirection;
  onClick: () => void;
  size?: "small" | "medium" | "large";
};

const directionConfig: Record<
  MoveShapeDirection,
  {
    icon: typeof ArrowUpwardIcon;
  }
> = {
  up: {
    icon: ArrowUpwardIcon,
  },
  down: {
    icon: ArrowDownwardIcon,
  },
  left: {
    icon: ArrowBackIcon,
  },
  right: {
    icon: ArrowForwardIcon,
  },
};

export const ArrowButton = ({
  direction,
  onClick,
  size = "small",
}: ArrowButtonProps) => {
  const config = directionConfig[direction];
  const Icon = config.icon;

  return (
    <Button
      variant="outlined"
      size={size}
      onClick={onClick}
      sx={{
        minWidth: "auto",
        paddingX: size === "large" ? 2 : size === "medium" ? 1.75 : 1.5,
        paddingY: size === "large" ? 1 : size === "medium" ? 0.75 : 0.5,
      }}
    >
      <Icon />
    </Button>
  );
};
