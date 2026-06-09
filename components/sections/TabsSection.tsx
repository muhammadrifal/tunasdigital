"use client";

import { useState } from "react";
import type { PageSection } from "@/lib/types";

interface TabItem {
  icon: string;
  title: string;
  description: string;
}

interface Tab {
  label: string;
  description: string;
  items: TabItem[];
}

export default function TabsSection({ section }: { section: PageSection }) {
  const { content } = section;
  const tabs: Tab[] = content.tabs ?? [];
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  const currentTab = tabs[activeTab];

  return (
    <section id={section.anchor_id || undefined} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            {content.heading}
          </h2>
        )}
        {content.subheading && (
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            {content.subheading}
          </p>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === i
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {currentTab && (
          <div>
            {currentTab.description && (
              <p className="text-center text-gray-500 mb-8 text-sm">
                {currentTab.description}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(currentTab.items ?? []).map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  {item.icon && (
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                      <i className={`${item.icon} text-orange-500`} />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
