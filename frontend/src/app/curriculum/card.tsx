import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

interface CurriculumCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function CurriculumCard({ title, description, imageSrc, imageAlt }: CurriculumCardProps) {
    return (
        <Card className="min-w-2xs">
            <Image
                src={imageSrc}
                alt={imageAlt}
                width={200}
                height={200}
                className="object-cover w-full h-32 rounded-t-lg"
            />
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}