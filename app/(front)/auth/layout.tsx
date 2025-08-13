const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main className="flex items-center justify-center">{children}</main>;
};

export default AuthLayout;
