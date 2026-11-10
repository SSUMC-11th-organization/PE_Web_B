export function ProfileAvatar({ imageUrl }: { imageUrl: string }) {
  return (
    <span className="avatar-circle">
      {imageUrl ? (
        <img className="avatar-photo" src={imageUrl} alt="프로필" />
      ) : (
        <img src="/icons/auth/person.svg" alt="" />
      )}
    </span>
  );
}
