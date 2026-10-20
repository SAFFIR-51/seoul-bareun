import ReferenceExperience from "./reference-experience";
import content from "./reference-content.json";

export default function DemoOnePage() {
  return <ReferenceExperience markup={content.markup} />;
}
