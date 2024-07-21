import ExecNavbar from "./component/ExecNavbar";

export default function RootLayout({ children }) {
  return (
    <>
        <ExecNavbar/>
        {children}
    </>
  )
}