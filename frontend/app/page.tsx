import Link from "next/link";
export default function Home() {
  return (
    <main className="w-screen h-screen p-10 flex flex-col  items-center">
      <div className="text-center p-6 max-w-2xl bg-white rounded-lg shadow-lg  ">
        <h1 className="text-xl  font-bold text-green-600 mb-4">
          Welcome to AppleDetect
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Discover the power of AI in apple farming. Our app helps you identify
          apple varieties and detect diseases and disorders with just a photo.
          Quick, accurate, and easy to use—AppleDetect is your go-to tool for
          ensuring the best quality apples every time.
        </p>
      </div>
      <div className="w-full  h-fit bg-slate-100 shadow-xl rounded-xl flex flex-col justify-center items-center p-5  gap-5 lg:flex-row mt-6">
        <div className="flex flex-col items-center gap-10  w-11/12">
          <a href="/camera">
            <div className="ring-2 ring-black rounded-3xl w-[200px] h-[200px] flex justify-center items-center text-5xl font-semibold hover:bg-slate-200 ">
              +
            </div>
          </a>
          <Link
            href={"/camera"}
            className="p-3 bg-red-400 rounded-3xl shadow-xl hover:bg-red-500 active:bg-red-600"
          >
            Detect Live
          </Link>
        </div>
        <div className="flex flex-col items-center gap-10 w-11/12">
          <a href="/image">
            <div className="ring-2 ring-black rounded-3xl w-[200px] h-[200px] flex justify-center items-center text-5xl font-semibold hover:bg-slate-200 ">
              +
            </div>
          </a>
          <Link
            href={"/image"}
            className="p-3 bg-red-400 rounded-3xl shadow-xl hover:bg-red-500 active:bg-red-600"
          >
            Detect Images
          </Link>
        </div>
      </div>
    </main>
  );
}
