import { motion, AnimatePresence } from 'framer-motion';
import styles from './index.module.less';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.toast}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

