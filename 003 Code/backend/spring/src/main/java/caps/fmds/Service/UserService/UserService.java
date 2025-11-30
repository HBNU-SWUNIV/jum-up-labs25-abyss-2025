package caps.fmds.Service.UserService;

import caps.fmds.item.Request.UserRequest;
import caps.fmds.item.User;

public interface UserService {
    User createUser(UserRequest request);
}
