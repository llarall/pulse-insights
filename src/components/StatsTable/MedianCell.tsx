import styles from "./MedianCell.module.css";

type TProps = {
	value: number;
	onClick?: () => void;
};

export const MedianCell = ({ value }: TProps) => {
	const formattedValue = value.toFixed(2) || "—";
	const isLow = value <= 5;

	return (
		<td className={isLow ? styles.lowValue : undefined}>{formattedValue}</td>
	);
};
