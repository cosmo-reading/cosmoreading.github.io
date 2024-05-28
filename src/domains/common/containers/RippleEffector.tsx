import styles from '@app/domains/common/containers/styles.module.scss';

export default function RippleEffector({ children }) {
    return (
        <div
            className="relative"
            onClick={e => {
                const target = e.currentTarget;

                const circle = document.createElement('span');
                const diameter = Math.max(target.clientWidth, target.clientHeight);
                const radius = diameter / 2;

                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${e.clientX - target.offsetLeft - radius}px`;
                circle.style.top = `${e.clientY - target.offsetTop - radius}px`;
                circle.classList.add(styles['ripple']);

                const ripple = target.getElementsByClassName('ripple')[0];

                if (ripple) {
                    ripple.remove();
                }

                target.appendChild(circle);
            }}
        >
            {children}
        </div>
    );
}
