import React from 'react';
import { AppView, Project } from '../types';

interface GalleryViewProps {
  onNavigate: (view: AppView) => void;
  projectName: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'test',
    version: 'VERSION 2',
    date: 'Invalid Date',
    elements: [],
    animations: [],
    duration: 5,
    lastModified: Date.now(),
    iconClass: 'ph-cube',
  },
  {
    id: '2',
    name: 'UI Experiments',
    version: 'VERSION 1',
    date: '2 hours ago',
    elements: Array(4).fill({} as any),
    animations: [],
    duration: 5,
    lastModified: Date.now(),
    iconClass: 'ph-palette',
  },
  {
    id: '3',
    name: 'Archive 01',
    version: 'LEGACY',
    date: 'Oct 24, 2023',
    elements: [],
    animations: [],
    duration: 5,
    lastModified: Date.now(),
    iconClass: 'ph-archive-box',
    legacy: true,
  },
];

export const GalleryView: React.FC<GalleryViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.EDITOR)}>
            <i className="ph-fill ph-circles-three-plus text-2xl text-primary"></i>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">dalley.</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-md mx-auto px-6 pt-2 pb-24 w-full">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 mb-2">
          <button className="flex-shrink-0 px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm shadow-lg transform transition-transform active:scale-95">
            Projects
          </button>
          <button className="flex-shrink-0 px-6 py-3 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Themes
          </button>
        </div>

        <div className="flex items-center justify-between mb-6 mt-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Saved Projects</h2>
          <button 
            onClick={() => onNavigate(AppView.EDITOR)}
            className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            <i className="ph-bold ph-plus"></i> New Project
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {PROJECTS.map((project) => (
            <div 
              key={project.id}
              className={`group relative bg-surface-light dark:bg-surface-dark rounded-plush p-6 border border-gray-100 dark:border-white/5 shadow-plush hover:shadow-xl hover:border-primary/20 transition-all duration-300 ${project.legacy ? 'opacity-60 hover:opacity-100' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{project.name}</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">{project.version || 'V1.0'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <i className={`ph-fill ${project.iconClass || 'ph-cube'} text-lg`}></i>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
                <div className="flex items-center gap-1.5">
                  <i className="ph ph-clock text-primary"></i>
                  <span>{project.date || 'Just now'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-1.5">
                  <i className="ph ph-layers"></i>
                  <span>{project.elements.length} elements</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate(AppView.EDITOR)}
                  className="flex-1 h-12 rounded-full bg-gradient-to-r from-primary to-rose-400 hover:to-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Load Project</span>
                  <i className="ph-bold ph-arrow-right"></i>
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 dark:hover:border-red-500/30 transition-colors">
                  <i className="ph ph-trash text-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button 
            className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center text-gray-900 dark:text-yellow-400 transition-all hover:scale-110 active:scale-90 border border-gray-100 dark:border-gray-700"
            onClick={() => document.documentElement.classList.toggle('dark')}
        >
            <i className="ph-fill ph-moon-stars dark:hidden text-xl"></i>
            <i className="ph-fill ph-sun hidden dark:block text-xl"></i>
        </button>
      </div>
    </div>
  );
};
