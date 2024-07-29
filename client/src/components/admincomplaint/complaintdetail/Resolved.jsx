import { useNavigate } from "react-router-dom";

function Resolved(props) {
  const navigate = useNavigate();
  return props.trigger ? (
    <>
      <div className="bg-black w-[100%] h-[100%] fixed flex items-center justify-center bottom-0 left-0 opacity-50 "></div>
      <div className="w-[528px] h-[200px] font-Nunito fixed z-10 top-1/3 left-1/3 ">
        <div className="w-[528px] h-[56px] bg-white rounded-t-[20px] border-[1px] border-[#E4E6ED] flex justify-between items-center">
          <p className="ml-[24px] font-semibold text-xl">Resolve Complaint</p>
          <div className="w-[41px] h-[40px] flex ">
            <button type="button" onClick={() => props.setTrigger(false)}>
              <img src="./src/assets/Vector.svg" alt="cross" />
            </button>
          </div>
        </div>
        <div className="w-[528px] h-[144px] bg-white flex flex-col rounded-b-[20px] border-[1px] border-[#E4E6ED] gap-6">
          <p className="text-base font-normal text-[#646D89] ml-[24px] mt-[24px]">
            This complaint is resolved?
          </p>
          <div className="flex gap-4 ml-[24px] ">
            <button
              type="button"
              className="w-[231px] h-[48px] bg-[#C70039] rounded-[99px] text-white text-base drop-shadow-RedButton"
            >
              Yes, it has been resolved
            </button>
            <button
              type="button"
              onClick={() => props.setTrigger(false)}
              className="w-[128px] h-[48px] bg-[#FFE1EA] rounded-[99px] text-[#95002B] text-base drop-shadow-PinkButton"
            >
              No, it’s not
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
export default Resolved;
