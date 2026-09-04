interface ErrorNoticeProps {
  message: string;
}

export function ErrorNotice({ message }: ErrorNoticeProps) {
  return (
    <p
      role="alert"
      className="border-rouge-signal bg-rouge-clair text-rouge-signal border-l-4 px-3 py-2 text-sm"
    >
      {message}
    </p>
  );
}
