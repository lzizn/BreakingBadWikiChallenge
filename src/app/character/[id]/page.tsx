"use server";

import { Episode, Character } from "@/types";

import { Loading, CharacterProfile, StarredEpisodes } from "@/components";
import { Metadata } from "next";

interface GetCharacterInfoByIdResponse {
  character: Character;
  starredEpisodes: Episode[];
}

interface CharacterPageParams {
  id: string;
}

interface CharacterPageProps {
  params: CharacterPageParams;
}

async function getCharacterInfoById(id: string) {
  const res = await fetch(`${process.env.URL}/api/character?id=${id}`);
  const { character, starredEpisodes }: GetCharacterInfoByIdResponse =
    await res.json();

  return {
    character,
    starredEpisodes,
  };
}

export async function generateStaticParams(): Promise<CharacterPageParams[]> {
  const res = await fetch(`${process.env.URL}/api/character`);

  if (!res.ok) {
    throw new Error("Error while fetching characters");
  }

  const characters: Character[] = await res.json();

  return characters.map((x) => ({ id: x.char_id + "" }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { character, starredEpisodes } = await getCharacterInfoById(params.id);

  return {
    title: "A Breaking Bad Wiki page about " + character.name,
    description: `status, picture, name, birthday, occupations and his ${starredEpisodes.length} featured episodes`,
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { character, starredEpisodes } = await getCharacterInfoById(params.id);

  if (!character || !starredEpisodes) return <Loading />;

  return (
    <div className="w-full max-w-[1500px] my-0 mx-auto flex flex-col items-center justify-start">
      <CharacterProfile character={character} />
      <StarredEpisodes episodes={starredEpisodes} />
    </div>
  );
}