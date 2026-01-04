"use client";

import Group from "./group";
import ProjectsPreview from "./projects-preview";

export default function PreviewPanel() {
  return (
    <div className="space-y-8">
      {/* Top Section: Community & Events */}
      <Group />

      {/* Bottom Section: Ongoing Projects */}
      <ProjectsPreview />
    </div>
  );
}
