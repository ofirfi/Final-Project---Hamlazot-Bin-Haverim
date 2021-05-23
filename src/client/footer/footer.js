import '../utils/style.css'



const Footer = () => {

    return (
        // <div className=" w-full underline mt-72 bottom-0 ">
        //     <a target="_blank" href="https://forms.gle/VGueMnszdPhMoGo17">נשמח שתשאירו פידבק ע"י לחיצה כאן</a>
        // </div>

        <div class="bg-gray-600 w-full mt-60 bottom-0">
            <footer class="w-screen flex flex-wrap items-center justify-between p-3 m-auto">
                <div class="container mx-auto w-full flex flex-col flex-wrap items-center justify-between">
                    <a className="text-white underline" target="_blank" href="https://forms.gle/VGueMnszdPhMoGo17">נשמח שתשאירו פידבק ע"י לחיצה כאן</a>
                    <div class="flex mx-auto text-white text-center">
                        כל הזכויות שמורות להמלצות בין חברים @ 2021
                    </div>
                </div>
            </footer>
        </div>
    )
}




export default Footer;