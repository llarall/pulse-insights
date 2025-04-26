import { HTMLAttributes } from "react";
import styles from "./Card.module.css";

type TProps = HTMLAttributes<HTMLDivElement> & {
	centered?: boolean;
	gray?: boolean;
};

/**
 * A reusable container component with default card styling.
 * Optionally centers its children using the `centered` prop.
 */
export const Card = ({
	className,
	centered,
	children,
	gray,
	...rest
}: TProps) => {
	const combinedClassName = [
		styles.card,
		centered && styles.centered,
		gray && styles.gray,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={combinedClassName} {...rest}>
			{children}
		</div>
	);
};
