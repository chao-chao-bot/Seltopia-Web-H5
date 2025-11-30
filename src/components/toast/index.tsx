import { motion, AnimatePresence } from 'framer-motion';
import styles from './index.module.less';

interface ToastProps {
  visible: boolean;
} 

export function Toast({ visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20,x: '-50%' }}
          animate={{ opacity: 1, y: 0,x: '-50%' }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.toast}
        >
          Link copied.
          <br />
          Ready for your Story.
        </motion.div>
      )}
    </AnimatePresence>
  );
}

