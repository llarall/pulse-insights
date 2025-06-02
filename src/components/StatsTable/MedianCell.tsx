import styles from "./MedianCell.module.css";

type TProps = {
	value: number;
	onClick?: () => void;
};

export const MedianCell = ({ value, onClick }: TProps) => {
	const formattedValue = value.toFixed(2) || "—";
	const isLow = value <= 5;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Enter" || e.key === " ") && isLow && onClick) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<td
			className={isLow ? styles.lowValue : undefined}
			onClick={isLow ? onClick : undefined}
			onKeyDown={isLow ? handleKeyDown : undefined}
			role={isLow ? "button" : undefined}
			tabIndex={isLow ? 0 : undefined}
		>
			{formattedValue}
		</td>
	);
};
