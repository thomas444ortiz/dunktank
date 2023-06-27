import { Avatar as ChakraAvatar } from "@chakra-ui/react"
import { Link as RouterLink} from "react-router-dom";
import { PROTECTED } from "../../lib/routes";

export default function Avatar({ user }){
    if (!user) return "Loading..."
    return(
        <ChakraAvatar 
            as={RouterLink}
            to={`${PROTECTED}/profile/${user?.id}`}
            name={user.username} 
            size="xl" 
            src={user.avatar} 
            _hover={{cursor: "pointer",  opacity: "0.8"}}
        />
    )
}