"use client";

import CreateBoardModal from "@/components/board/CreateNewBoardModal";
import UserAllBoards from "@/components/board/UserAllBoards";
import Container from "@/utils/Container";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="md:flex py-6 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Your Workspace</h1>
            <p className="text-sm text-gray-500">Create, manage, and collaborate on your boards with ease.</p>
          </div>
          <CreateBoardModal></CreateBoardModal>
        </div>
        <UserAllBoards></UserAllBoards>
      </Container>
    </main>
  );
};

export default HomePage;
