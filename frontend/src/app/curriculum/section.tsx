import CurriculumCard from "./card";

export default function CurriculumSection() {
    return (
        <section id="curriculum-section" className="flex flex-col gap-6 w-full px-6 py-8 bg-zinc-100">
            <h1 className="text-4xl font-bold">Curriculum</h1>
            <div className="flex gap-4 mt-4 overflow-x-scroll">
                <CurriculumCard title="Curriculum 1" description="Description 1" imageSrc="/file.svg" imageAlt="Curriculum 1" />
                <CurriculumCard title="Curriculum 2" description="Description 2" imageSrc="/file.svg"imageAlt="Curriculum 2" />
                <CurriculumCard title="Curriculum 3" description="Description 3" imageSrc="/file.svg" imageAlt="Curriculum 3" />
            </div>
        </section>
    );
}