import { useState } from "react";
import { doc, setDoc, query, collection, orderBy, updateDoc, arrayRemove, arrayUnion, deleteDoc, getDoc, where } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { db } from "../lib/firebase"
import { useToast } from "@chakra-ui/react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export function useAddPost(){
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    async function addPost(post) {
        setLoading(true);
        const id = uuidv4();
        await setDoc(doc(db, "posts", id), { 
            ...post, 
            id,
            date: Date.now(),
            likes: [],
            isDunked: (false),
        });
        toast({title: "Your post was successfully added", status: "success", isClosable: true, position: "top", duration: 5000 });        
        setLoading(false);
    }
    return {addPost, isLoading};
}

export function usePosts(uid = null) {
    const q = uid 
    ? query (
      collection(db, "posts"), 
      orderBy('date', "desc"), 
      where("uid","==",uid),
      where ("isDunked","==", true))
    : query(collection(db, "posts"), 
    orderBy('date', "desc"));
    const [posts, isLoading, error] = useCollectionData(q);
    if (error) throw error;
    return { posts, isLoading };
}

export function useToggleLike ({id, isLiked, uid}) {
    const [isLoading, setLoading] = useState(false);

    async function toggleLike() {
        setLoading(true);
        const docRef = doc(db, "posts", id);
        await updateDoc(docRef, {
            likes: isLiked? arrayRemove(uid) : arrayUnion(uid),
        });
        setLoading(false);
    }
    return{ toggleLike, isLoading}
}

export function useAttemptDunk ({id}) {
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    const probability = 5;
  
    async function attemptDunk() {
      setLoading(true);
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      const isDunked = docSnap.data()?.isDunked;
  
      if (isDunked === true) {
        setLoading(false);
        return;
      }
  
      const randomNumber = Math.floor(Math.random() * probability);
      if (randomNumber === 1) {
        await updateDoc(docRef, {
          isDunked: true,
        });
      }
      toast({
        title: randomNumber === 1 ? "Your dunk attempt was successful" : `Your dunk attempt was not successful (you have a 1 in ${probability} chance)`,
        status: "success",
        isClosable: true,
        position: "top",
        duration: 5000
      });
      setLoading(false);
    }
    return { attemptDunk, isLoading };
  }

export function useDeletePost(id){
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    async function deletePost(){
        const res = window.confirm("Are you sure you want to delete this post?");
        if (res) {
            setLoading(true)
            await deleteDoc(doc(db,"posts",id));
            
            toast({
                title: "Post deleted!",
                status: "info",
                isClosable: true,
                position: "top",
                duration: 5000,
            });

            setLoading(false)
        }
    }
    return { deletePost, isLoading };
}