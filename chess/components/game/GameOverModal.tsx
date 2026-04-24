import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameOverModalProps {
  visible: boolean;
  result: string;
  onRematch: () => void;
  onExit: () => void;
}

export function GameOverModal({ visible, result, onRematch, onExit }: GameOverModalProps) {
  return (
    <Dialog open={visible} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] w-[90vw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">🏆 Game Over 🏆</DialogTitle>
          <DialogDescription className="text-center text-base">
            {result}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-3 w-full">
          <Button onPress={onRematch}>
            Play Again
          </Button>
          <Button variant="outline" onPress={onExit}>
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}