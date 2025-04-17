import React, { useEffect, useState } from "react";
import { FiSearch, FiMail, FiPhone, FiMapPin, FiUser, FiClock, FiEdit, FiTrash2, FiChevronLeft, FiX } from "react-icons/fi";
import { BsThreeDotsVertical, BsShieldCheck } from "react-icons/bs";
import SpecialPrivateChat from "./SpecialPrivateChat";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`https://shiplink.onrender.com/api/v1/auth/users`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users.filter((user) => user.role === "User"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCurrentUsers = async () => {
    try {
      const res = await fetch(`https://shiplink.onrender.com/api/v1/auth/user/profile`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data?.profileDetails);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUsers();
    fetchUsers();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && selectedUser) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeTab === "all" || user.role.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'shipper': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
    if (isMobile) {
      setIsMobileSidebarOpen(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row pt-20 h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {selectedUser ? (
        <>
                {/* <button 
            onClick={handleBackToUserList}
            className="flex items-center text-indigo-600"
          >
            <FiChevronLeft className="mr-1" />
            Back
          </button>  */}
        </>
        ) : (
          <h1 className="text-xl font-bold text-gray-800 text-center items-center">Shippers</h1>
        )}
        {!isMobileSidebarOpen && selectedUser && (
        <>
         {/* <h2 className="text-lg font-semibold truncate max-w-xs">{selectedUser.name}</h2>  */}
        </>
        )}
        {isMobileSidebarOpen && (
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiX className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Sidebar with user list */}
      <div className={`${isMobileSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out`}>
        {/* Header with search and tabs */}
        <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 hidden md:block text-center items-center">Shippers</h1>
          
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1 text-xs md:text-sm rounded-full ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-xs md:text-sm rounded-full ${activeTab === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('user')}
            >
              Users
            </button>
            <button
              className={`px-3 py-1 text-xs md:text-sm rounded-full ${activeTab === 'shipper' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('shipper')}
            >
              Shippers
            </button>
            <button
              className={`px-3 py-1 text-xs md:text-sm rounded-full ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admins
            </button>
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FiUser className="text-4xl mb-2" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?._id === user._id ? 'bg-indigo-50' : ''}`}
                onClick={() => {
                  setSelectedUser(user);
                  if (isMobile) {
                    setIsMobileSidebarOpen(false);
                  }
                }}
              >
                <div className="relative mr-3">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt={user.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  {user.role === 'Admin' && (
                    <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-1">
                      <BsShieldCheck size={10} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm md:text-base font-medium text-gray-900 truncate">{user.name}</h2>
                    <span className="text-xs text-gray-500">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs md:text-sm text-gray-500 truncate">{user.email}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[9px] font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User details panel */}
      <div className={`${!isMobileSidebarOpen || !isMobile ? 'flex' : 'hidden'} flex-1 flex-col bg-white`}>
        {selectedUser ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center md:hidden">
              <button 
                onClick={handleBackToUserList}
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
              >
                <FiChevronLeft className="text-gray-600" />
              </button>
              <div className="flex items-center">
                {selectedUser.profile ? (
                  <img
                    src={selectedUser.profile}
                    alt={selectedUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-2">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
                <h2 className="font-medium">{selectedUser.name}</h2>
              </div>
            </div>
            <SpecialPrivateChat user1={currentUser?._id} user2={selectedUser?._id} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-indigo-500 text-2xl md:text-3xl" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No user selected</h2>
              <p className="text-sm md:text-base text-gray-500 mb-6">
                Select a user from the list to view their details and account information
              </p>
              {users.length > 0 && (
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm md:text-base"
                  onClick={() => {
                    setSelectedUser(users[0]);
                    if (isMobile) {
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                >
                  Select First User
                </button>
              )}
              {isMobile && (
                <button 
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm md:text-base"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  Show User List
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllUsers;