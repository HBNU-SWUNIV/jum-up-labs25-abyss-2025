package caps.fmds.Service.UserService;

import caps.fmds.Repository.UserGroupRepository;
import caps.fmds.Repository.UserRepository;
import caps.fmds.item.Request.UserRequest;
import caps.fmds.item.User;
import caps.fmds.item.UserGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;

    @Override
    public User createUser(UserRequest request) {
        UserGroup group = userGroupRepository.findByName(request.getGroupName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 그룹입니다 => " + request.getGroupName()));

        if (userRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이름입니다 => " + request.getName());
        }

        User user = new User();
        user.setName(request.getName());
        user.setAdmin(request.getAdmin());
        user.setUserGroup(group);

        return userRepository.save(user);
    }
}