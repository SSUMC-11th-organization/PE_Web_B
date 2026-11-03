interface MovieImageProps { src: string | null; alt: string; className?: string }
export function MovieImage({ src, alt, className = "" }: MovieImageProps) {
  return src ? <img className={className} src={src} alt={alt} /> : (
    <div className={`flex items-center justify-center bg-gray-200 text-sm text-gray-600 ${className}`} role="img" aria-label={alt}>이미지 없음</div>
  );
}
