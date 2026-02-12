import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';

interface UserPhoto {
  id: string;
  url: string;
  caption: string;
  votes: number;
  comments: number;
  category: string;
  createdAt: string;
  aspectRatio?: string;
}

export function useUserPhotos() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserPhotos = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        // In a real app, you would fetch the user's photos from your API
        // const response = await fetch(`/api/users/${user.id}/photos`);
        // const data = await response.json();
        
        // For now, we'll use sample data that matches the photo gallery
        const samplePhotos: UserPhoto[] = [
          {
            id: "1",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXddFsc2ZN8pvT0JDHluovLkrnIVCWnx3vsg&s",
            caption: "Morning workout session - feeling strong! 💪",
            votes: 45,
            comments: 12,
            category: "Workout",
            createdAt: new Date().toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "2",
            url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
            caption: "Post-gym selfie. The grind never stops! 🔥",
            votes: 67,
            comments: 23,
            category: "Progress",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "3",
            url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
            caption: "Beach body ready for summer! ☀️ #SummerReady",
            votes: 156,
            comments: 42,
            category: "Transformation",
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "4",
            url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=600&fit=crop",
            caption: "Competition prep is paying off! 🏆 #Bodybuilding",
            votes: 210,
            comments: 56,
            category: "Competition",
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "5",
            url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
            caption: "Back day complete! Feeling the pump 💪 #BackDay",
            votes: 78,
            comments: 19,
            category: "Bodybuilding",
            createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "6",
            url: "https://shotkit.com/wp-content/uploads/2021/07/alexi-romano-hip-pop.jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Outdoor",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "7",
            url: "https://www.shutterstock.com/image-photo/man-doing-pullups-fitness-gym-600nw-1996094180.jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Chin-up",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "8",
            url: "https://images.ctfassets.net/8urtyqugdt2l/4wPk3KafRwgpwIcJzb0VRX/4894054c6182c62c1d850628935a4b0b/desktop-best-chest-exercises.jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Bench-Press",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "9",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGtz2RcQ0RtTcxXuSvMBtDw5s8P3O5kI2zw&s",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Squat",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "10",
            url: "https://images.pexels.com/photos/17944268/pexels-photo-17944268.jpeg?cs=srgb&dl=pexels-bi-lal-karadag-582268222-17944268.jpg&fm=jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Overhead-Press",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "11",
            url: "https://flex-web-media-prod.storage.googleapis.com/2025/05/barbell-row-exercise-gym.jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Barbell-Row",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "12",
            url: "https://c8.alamy.com/comp/W1MAGJ/shirtless-muscular-man-doing-dips-exercise-at-the-gym-W1MAGJ.jpg",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Dip",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
          {
            id: "13",
            url: "https://cdn.sanity.io/images/263h0ltd/production/071340b632a59d0c502b5213775fdb392b846d93-600x400.jpg?w=1500&q=90&fit=fillmax&auto=format",
            caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
            votes: 134,
            comments: 31,
            category: "Front-Squat",
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            aspectRatio: "9/16"
          },
        ];

        setPhotos(samplePhotos);
      } catch (err) {
        console.error("Error fetching user photos:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch photos'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhotos();
  }, []);

  return { photos, loading, error };
}
