import styles from "./MedianCell.module.css";

type TProps = {
	value: number;
	onClick?: () => void;
};

/*
 * A table cell for any median value to highlight low values
 */
export const MedianCell = ({ value }: TProps) => {
	const formattedValue = value.toFixed(2) || "—";
	const isLow = value < 4;
	const isHigh = value >= 5;
	var cellClass = undefined;

	if (isLow) {
		cellClass = styles.lowValue;
	} else if (isHigh) {
		cellClass = styles.highValue;
	}

	return (
		<td className={cellClass}>{formattedValue}</td>
	);
};
