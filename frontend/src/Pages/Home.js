import Hero from "../Components/Hero";
import Chat from "../Components/Chat";

const Home = ({ supabase, session, videoBlob, setVideoBlob, videos, setVideos }) => {
  return (
    <div>
      <Hero />
      <Chat
        supabase={supabase}
        session={session}
        videoBlob={videoBlob}
        setVideoBlob={setVideoBlob}
        videos={videos}
        setVideos={setVideos}
      />
    </div>
  );
};

export default Home;