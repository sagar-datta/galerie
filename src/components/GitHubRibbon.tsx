import styles from "./GitHubRibbon.module.css";
import { COLORS } from "../constants/colors";

export const GitHubRibbon = () => {
  return (
    <div className={styles["github-corner"]}>
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        style={{
          fill: COLORS.dark,
          color: COLORS.beige,
          position: "absolute",
          top: 0,
          right: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <a
          href="https://github.com/sagar-datta/photo-gallery"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
        >
          <path
            d="M0,0 L30,30 L34,34 L60,60 L60,0 Z"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
          />
        </a>
        <path
          d="M30.8,26.2 C27.3,23.9 28.6,21.5 28.6,21.5 C29.3,19.9 29.0,18.9 29.0,18.9 C28.6,17.3 29.6,18.3 29.6,18.3 C30.6,19.4 30.1,21.0 30.1,21.0 C29.5,23.4 31.3,24.5 32.3,24.8"
          fill="currentColor"
          style={{ transformOrigin: "31.2px 25.4px" }}
          className={styles["octo-arm"]}
        />
        <path
          d="M27.6,27.6 C27.6,27.6 28.5,28.0 28.8,27.7 L32.1,24.4 C32.9,23.8 33.6,23.6 34.1,23.7 C32.1,21.1 30.6,17.9 34.5,13.9 C35.6,12.8 36.9,12.3 38.3,12.2 C38.5,11.9 39.2,10.5 41.1,9.6 C41.1,9.6 42.3,10.2 42.9,13.5 C43.9,14.1 44.9,14.8 45.8,15.7 C46.7,16.6 47.4,17.6 48.0,18.6 C51.3,19.2 51.9,20.4 51.9,20.4 C51.0,22.3 49.7,23.0 49.3,23.2 C49.2,24.6 48.7,25.9 47.6,27.0 C43.7,30.9 40.4,29.4 37.8,27.4 C37.9,28.0 37.6,28.9 36.7,29.9 L33.8,32.7 C33.5,33.1 33.9,33.9 34.0,33.9 Z"
          fill="currentColor"
          className={styles["octo-body"]}
        />
      </svg>
    </div>
  );
};
