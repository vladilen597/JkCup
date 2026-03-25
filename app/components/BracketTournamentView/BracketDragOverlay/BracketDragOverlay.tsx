import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import DraggableTeam from "../DraggableTeam/DraggableTeam";
import DraggableUser from "../DraggableUser/DraggableUser";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

interface BracketDragOverlayProps {
  activeBlock: any;
  isTeamMode: boolean;
}

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

const BracketDragOverlay = ({
  activeBlock,
  isTeamMode,
}: BracketDragOverlayProps) => {
  if (!activeBlock) return null;

  return (
    <DragOverlay dropAnimation={dropAnimation} modifiers={[snapCenterToCursor]}>
      <div className="opacity-80 scale-105 pointer-events-none">
        {isTeamMode ? (
          <DraggableTeam team={activeBlock} />
        ) : (
          <DraggableUser user={activeBlock} />
        )}
      </div>
    </DragOverlay>
  );
};

export default BracketDragOverlay;
