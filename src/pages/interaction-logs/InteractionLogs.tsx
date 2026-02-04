import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Interaction, ExpandedFilters } from "./types";
import { mockInteractions, stats } from "./data";
import { InteractionLogsHeader } from "./components/InteractionLogsHeader";
import { InteractionLogsFilters } from "./components/InteractionLogsFilters";
import { InteractionLogsTable } from "./components/InteractionLogsTable";
import { InteractionLogsDetail } from "./components/InteractionLogsDetail";

const InteractionLogs = () => {
  const { collapsed } = useSidebar();

  // Selection state
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(mockInteractions[1]);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Notes state
  const [newNote, setNewNote] = useState('');

  // Filter states
  const [expandedFilters, setExpandedFilters] = useState<ExpandedFilters>({
    type: true,
    status: true,
    event: false,
    recipient: false,
    load: false,
    additional: false
  });

  const toggleFilter = (category: keyof ExpandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className={cn("transition-all duration-300 flex flex-col h-screen", collapsed ? "pl-16" : "pl-64")}>
        <Header />

        {/* Top Header Bar */}
        <InteractionLogsHeader
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Content - Three Column Layout with CSS Grid */}
        <div className="flex-1 grid grid-cols-[280px_1fr_384px] overflow-hidden min-w-0">
          {/* Left Sidebar - Filters */}
          <InteractionLogsFilters
            expandedFilters={expandedFilters}
            toggleFilter={toggleFilter}
          />

          {/* Center - Interaction List */}
          <InteractionLogsTable
            interactions={mockInteractions}
            selectedInteraction={selectedInteraction}
            onSelectInteraction={setSelectedInteraction}
          />

          {/* Right Panel - Detail View */}
          <InteractionLogsDetail
            selectedInteraction={selectedInteraction}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            playbackProgress={playbackProgress}
            setPlaybackProgress={setPlaybackProgress}
            newNote={newNote}
            setNewNote={setNewNote}
          />
        </div>
      </main>
    </div>
  );
};

export default InteractionLogs;
