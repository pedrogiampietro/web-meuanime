import { MediaCard } from "../cards/MediaCard";

const FEATURED_CONTENT = [
  {
    id: 1,
    title: "Breaking Bad",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=Breaking+Bad",
    type: "series",
    rating: "18+",
    year: 2008,
  },
  {
    id: 2,
    title: "The Walking Dead",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=The+Walking+Dead",
    type: "series",
    rating: "16+",
    year: 2010,
  },
  {
    id: 3,
    title: "Stranger Things",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=Stranger+Things",
    type: "series",
    rating: "14+",
    year: 2016,
  },
  {
    id: 4,
    title: "The Witcher",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=The+Witcher",
    type: "series",
    rating: "18+",
    year: 2019,
  },
  {
    id: 5,
    title: "Dark",
    imageUrl: "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=Dark",
    type: "series",
    rating: "16+",
    year: 2017,
  },
  {
    id: 6,
    title: "The Mandalorian",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=The+Mandalorian",
    type: "series",
    rating: "14+",
    year: 2019,
  },
  {
    id: 7,
    title: "Black Mirror",
    imageUrl:
      "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=Black+Mirror",
    type: "series",
    rating: "18+",
    year: 2011,
  },
  {
    id: 8,
    title: "The Boys",
    imageUrl: "https://placehold.co/480x270/242a4d/7f84b5/jpeg?text=The+Boys",
    type: "series",
    rating: "18+",
    year: 2019,
  },
] as const;

export function FeaturedSection() {
  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_CONTENT.map((item) => (
          <MediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
