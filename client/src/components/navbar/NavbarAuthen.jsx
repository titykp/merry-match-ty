import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Portal from "./Portal";
import { useAuth } from "../../contexts/authentication";
import headerMerryMatchLogo from "/assets/header-image/header-merrymatch-logo.svg";
import iconBell from "/assets/navbar-image/icon_bell.png";
import iconChat from "/assets/navbar-image/icon_chat.png";
import profileMenu1 from "/assets/navbar-image/profile_menu1.png";
import profileMenu2 from "/assets/navbar-image/profile_menu2.png";
import profileMenu3 from "/assets/navbar-image/profile_menu3.png";
import profile from "/assets/navbar-image/profile.png";
import icon1 from "/assets/navbar-image/icon1.png";
import icon2 from "/assets/navbar-image/icon2.png";
import icon3 from "/assets/navbar-image/icon3.png";
import icon4 from "/assets/navbar-image/icon4.png";
import icon5 from "/assets/navbar-image/icon5.png";
import icon6 from "/assets/navbar-image/icon6.png";

const NavbarAuthen = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [bellMenuOpen, setBellMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const bellIconRef = useRef(null);
  const profileIconRef = useRef(null);
  const [bellMenuPosition, setBellMenuPosition] = useState({ top: 0, left: 0 });
  const [profileMenuPosition, setProfileMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleBellClick = () => {
    setBellMenuOpen(!bellMenuOpen);
    setProfileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(!profileMenuOpen);
    setBellMenuOpen(false);
  };

  const { logout, state } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (bellIconRef.current) {
      const bellRect = bellIconRef.current.getBoundingClientRect();
      setBellMenuPosition({ top: bellRect.bottom, left: bellRect.left });
    }
  }, [bellMenuOpen]);

  useEffect(() => {
    if (profileIconRef.current) {
      const profileRect = profileIconRef.current.getBoundingClientRect();
      setProfileMenuPosition({
        top: profileRect.bottom,
        left: profileRect.left,
      });
    }
  }, [profileMenuOpen]);

  return (
    <nav className="Navbar text-[#64001D] text-[1rem] font-Nunito bg-[#FFFFFF] fixed z-20 overflow-auto flex items-center justify-between w-full lg:h-[88px] h-[52px] font-bold shadow-[2px 2px 12px 0 rgba(64, 50, 133, 0.12)]">
      <div className="flex items-center justify-between w-full lg:w-[1440px] mx-auto px-4 lg:px-0">
        <button onClick={() => navigate("/")}>
          <img
            src={headerMerryMatchLogo}
            alt="merry-match-logo"
            className="lg:ml-[170px] h-[44px]"
          />
        </button>
        <div className="flex gap-4 lg:hidden ml-24">
          <button onClick={() => navigate("/")}>
            <img
              src={iconBell}
              alt="merry-match-message"
              className="h-[26px] w-[26px]"
            />
          </button>
          <button onClick={() => navigate("/")}>
            <img
              src={iconChat}
              alt="merry match notification"
              className="h-[26px] w-[26px]"
            />
          </button>
        </div>

        {/*---------------------------------------- Hamburger Menu for Mobile ---------------------------------------------*/}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#191C77] text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/*-------------------------------------------- Desktop Menu -----------------------------------------------*/}
        <div className="hidden lg:flex lg:items-end lg:justify-between lg:gap-8 inset-0 top-[52px] lg:top-auto lg:static bg-white lg:bg-transparent lg:ml-[432px]">
          <button onClick={() => navigate("/")}>Start Matching!</button>
          <button onClick={() => navigate("/")}>Merry Membership</button>
        </div>

        {/* ------------------------------------------notification ---------------------------------------------------- */}

        <div className="hidden lg:flex lg:items-end lg:gap-4 inset-0 top-[52px] lg:top-auto lg:static bg-white lg:bg-transparent lg:mr-[160px]">
          <div className="relative">
            <button ref={bellIconRef} onClick={handleBellClick}>
              <img
                src={iconBell}
                alt="merry-match-bell"
                className="h-[48px] w-[48px]"
              />
            </button>
            {bellMenuOpen && (
              <Portal>
                <div
                  style={{
                    position: "fixed",
                    top: `${bellMenuPosition.top}px`,
                    left: `${bellMenuPosition.left}px`,
                    transform: "translateX(-50%)",
                    marginTop: "32px",
                  }}
                  className="w-[250px] h-[215px] font-[500] bg-white shadow-lg rounded-[16px] py-2 z-10 font-Nunito text-sm"
                >
                  <div className="flex items-center h-[66px] p-[8px]">
                    <img
                      src={profileMenu1}
                      alt="icon2"
                      className="ml-1 mr-3 h-[32px] w-[32px]"
                    />
                    <button
                      onClick={() => navigate("/")}
                      className="text-start"
                    >
                      ‘Khal Drogo’ Just Merry you! Click here to see profile
                    </button>
                  </div>
                  <div className="flex items-center h-[66px] p-[8px]">
                    <img
                      src={profileMenu2}
                      alt="icon2"
                      className="ml-1 mr-3 h-[32px] w-[32px]"
                    />
                    <button
                      onClick={() => navigate("/")}
                      className="text-start"
                    >
                      ‘Daeny’ Merry you back! Let’s start conversation now
                    </button>
                  </div>
                  <div className="flex items-center h-[66px] p-[8px]">
                    <img
                      src={profileMenu3}
                      alt="icon2"
                      className="ml-1 mr-3 h-[32px] w-[32px]"
                    />
                    <button
                      onClick={() => navigate("/")}
                      className="text-start"
                    >
                      ‘Ygritte’ Merry you back! Let’s start conversation now
                    </button>
                  </div>
                </div>
              </Portal>
            )}
          </div>
          {/* ------------------------------------------ profile menu ---------------------------------------------------- */}
          <div className="relative">
            <button ref={profileIconRef} onClick={handleProfileClick}>
              <img
                src={profile}
                alt="merry match profile"
                className="h-[48px] w-[48px]"
              />
            </button>
            {profileMenuOpen && (
              <Portal>
                <div
                  id="portal-root"
                  style={{
                    position: "fixed",
                    top: `${profileMenuPosition.top}px`,
                    left: `${profileMenuPosition.left}px`,
                    transform: "translateX(-50%)",
                    marginTop: "32px",
                  }}
                  className="w-[198px] h-[258px] font-[500] bg-white shadow-lg rounded-[16px] py-2 z-10 font-Nunito text-sm"
                >
                  <div className="flex justify-center items-center pb-2 pt-0.5 ">
                    <button
                      className="flex justify-center items-center bg-gradient-to-r from-[#742138] to-[#A878BF] button-nav shadow-[2px 2px 12px 0 rgba(64, 50, 133, 0.16)] rounded-[99px] text-[#ffffff] h-[41px] w-[179px] "
                      onClick={() => {
                        navigate("/");
                        setIsOpen(false);
                      }}
                    >
                      <img src={icon1} alt="icon1" className="mr-2 " />
                      More limit Merry!
                    </button>
                  </div>
                  <div className="flex items-center h-[37px] p-[8px]">
                    <img src={icon2} alt="icon2" className="mr-2  pl-4" />
                    <button
                      onClick={() => navigate(`/user-profile/${state.user.id}`)}
                    >
                      Profile
                    </button>
                  </div>
                  <div className="flex items-center h-[37px] p-[8px]">
                    <img src={icon3} alt="icon3" className="mr-2 pl-4" />
                    <button onClick={() => navigate("/")}>Merry list</button>
                  </div>
                  <div className="flex items-center h-[37px] p-[8px]">
                    <img src={icon4} alt="icon4" className="mr-2 pl-4" />
                    <button onClick={() => navigate("/")}>
                      Merry Membership
                    </button>
                  </div>
                  <div className="flex items-center h-[37px] p-[8px] mb-1">
                    <img src={icon5} alt="icon5" className="mr-2 pl-4" />
                    <button onClick={() => navigate("/")}>Compliant</button>
                  </div>
                  <div className="mx-auto border-t border-gray-300 w-full p-[2px]"></div>
                  <div className="flex items-center h-[37px] p-[8px]">
                    <img src={icon6} alt="icon6" className="mr-2 pl-4" />
                    <button onClick={handleLogout}>Log out</button>
                  </div>
                </div>
              </Portal>
            )}
          </div>
        </div>
      </div>

      {/*------------------------------------- Mobile Menu -------------------------------------------------- */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[52px] bg-white z-10 font-Nunito text-gray-700 font-medium">
          <div className="flex justify-center items-center p-[16px] pt-[24px]">
            <button
              className="flex justify-center items-center bg-gradient-to-r from-[#742138] to-[#A878BF] button-nav shadow-[2px 2px 12px 0 rgba(64, 50, 133, 0.16)] rounded-[99px] text-[#ffffff] h-[41px] w-[343px] font-[700]"
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
            >
              <img src={icon1} alt="icon1" className="mr-2" />
              More limit Merry!
            </button>
          </div>
          <div className="flex items-center p-[12px]">
            <img src={icon2} alt="icon2" className="mr-2 p-[10px] pl-8" />
            <button onClick={() => navigate("/")}>Profile</button>
          </div>
          <div className="flex items-center p-[12px]">
            <img src={icon3} alt="icon3" className="mr-2 p-[10px] pl-8" />
            <button onClick={() => navigate("/")}>Merry list</button>
          </div>
          <div className="flex items-center p-[12px]">
            <img src={icon4} alt="icon4" className="mr-2 p-[10px] pl-8" />
            <button onClick={() => navigate("/")}>Merry Membership</button>
          </div>
          <div className="flex items-center p-[12px]">
            <img src={icon5} alt="icon5" className="mr-2 p-[10px] pl-8" />
            <button onClick={() => navigate("/")}>Compliant</button>
          </div>
          <div className="mx-auto border-t border-gray-300 w-[343px] my-4"></div>
          <div className="flex items-center p-[12px] pt-0">
            <img src={icon6} alt="icon6" className="mr-2 p-[10px] pl-8" />
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAuthen;
