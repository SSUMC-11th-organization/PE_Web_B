import { cn } from "../../utils/cn";

interface ProfileAvatarProps {
    imageUrl: string | null;
    className?: string;
}

export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
    return (
        <span
            className={cn(
                "flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-line",
                className,
            )}
        >
            {imageUrl ? (
                <img className="size-full object-cover" src={imageUrl} alt="프로필 이미지" />
            ) : (
                <img className="size-9" src="/icons/person.svg" alt="" />
            )}
        </span>
    );
}
