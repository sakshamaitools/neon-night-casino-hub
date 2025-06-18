
const GamesHeader = () => {
  return (
    <div className="text-center mb-16 relative">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-purple-400/10 to-pink-400/10 blur-3xl -z-10" />
      
      <div className="relative">
        <h1 className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent glow">
          Game Library
        </h1>
        
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6 rounded-full" />
        
        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover hundreds of premium casino games with stunning graphics, 
          <span className="text-yellow-400 font-semibold"> exciting gameplay</span>, and 
          <span className="text-green-400 font-semibold"> massive jackpots</span>
        </p>
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/20 rounded-full blur-sm float" />
        <div className="absolute -top-8 -right-8 w-6 h-6 bg-purple-400/20 rounded-full blur-sm float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-4 left-1/4 w-4 h-4 bg-pink-400/20 rounded-full blur-sm float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default GamesHeader;
