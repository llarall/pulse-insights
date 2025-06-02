import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
}) => {
	const overlayRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", onKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen, onClose]);

	const onOverlayClick = (e: React.MouseEvent) => {
		if (e.target === overlayRef.current) {
			onClose();
		}
	};

	useEffect(() => {
		if (!isOpen) return;

		const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		const first = focusableElements?.[0];
		const last = focusableElements?.[focusableElements.length - 1];

		const trap = (e: KeyboardEvent) => {
			if (e.key !== "Tab" || !first || !last) return;

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", trap);
		first?.focus();

		return () => document.removeEventListener("keydown", trap);
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={overlayRef}
			className={styles.overlay}
			onClick={onOverlayClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div ref={modalRef} className={styles.modal} role="document">
				<div className={styles.header}>
					<h2 id="modal-title">{title}</h2>
					<button
						onClick={onClose}
						aria-label="Close modal"
						className={styles.closeButton}
					>
						&times;
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};
