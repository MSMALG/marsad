import mersadRobotImg from "../../../assets/mersad-robot.png";

type Props = { size?: number };

export default function MersadRobot({ size = 120 }: Props) {
  return (
    <img
      src={mersadRobotImg}
      alt="مرصاد"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
