import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


interface Player {
  avatar: string;
  name: string;
  selectedValue?: string;
}

interface PlayerAvatarProps {
  player: Player;
  revealed: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, revealed }) => (
    <div className="flex flex-col items-center gap-2 w-16">
      <div className="relative">
        <div className="absolute -top-1 left-1/2 h-20 w-16 -translate-x-1/2 transform rounded-lg bg-[#E6EEFB]" /> 
        <Avatar className="relative h-10 w-10">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback>{revealed ? player.selectedValue : player.name[0] }</AvatarFallback>
        </Avatar>
        {/* {revealed && player.selectedValue && (
          <div className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 transform rounded-full px-2 py-1 text-xs font-bold shadow bg-white">
            {player.selectedValue}
          </div>
        )} */}
      </div>
      <span className="text-sm text-black text-center font-medium m-1 z-10 w-full text-ellipsis overflow-hidden">
        {player.name}
      </span>
    </div>
  );

export default PlayerAvatar;